import React, { ChangeEvent } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDebounceCallback } from "@react-hook/debounce";
import { Location } from "history";
import {
  useCluster,
  ClusterStatus,
  clusterUrl,
  clusterName,
  clusterSlug,
  CLUSTERS,
  Cluster,
  useClusterModal,
  useUpdateCustomUrl,
} from "providers/cluster";
import { assertUnreachable, localStorageIsAvailable } from "../utils";
import { Overlay } from "./common/Overlay";
import { useQuery } from "utils/url";
import { Button, Drawer, Switch, Typography } from "@mui/material";

export function ClusterModal() {
  const [show, setShow] = useClusterModal();
  const onClose = () => setShow(true);
  const showDeveloperSettings = localStorageIsAvailable();
  const enableCustomUrl =
    showDeveloperSettings && localStorage.getItem("enableCustomUrl") !== null;
  const onToggleCustomUrlFeature = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      localStorage.setItem("enableCustomUrl", "");
    } else {
      localStorage.removeItem("enableCustomUrl");
    }
  };

  return (
    <>
      <Drawer anchor="right" open={!show} onClose={onClose}>
        <div
          className={`modal fade fixed-right${show ? " show" : ""} w-96`}
        >
          <div className="modal-dialog modal-dialog-vertical">
            <div className="modal-content">
              <div className="modal-body" onClick={(e) => e.stopPropagation()}>
                <Typography variant="h3" className="text-center py-4">
                  Choose a Cluster
                </Typography>
                <ClusterToggle />

                {showDeveloperSettings && (
                  <>
                    <hr className="border-grey-light px-4" />

                    <Typography variant="h3" className="py-4 text-center">Developer Settings</Typography>
                    <div className="flex justify-between px-4">
                      <span className="mr-3">Enable custom url param</span>
                      <Switch defaultChecked={enableCustomUrl}
                        id="cardToggle"
                        onChange={onToggleCustomUrlFeature}
                      />
                    </div>
                    <Typography variant="body2" color="secondary" className="px-4">
                      Enable this setting to easily connect to a custom cluster
                      via the "customUrl" url param.
                    </Typography>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <Overlay show={show} />
      </Drawer>
    </>
  );
}

type InputProps = { activeSuffix: string; active: boolean };
function CustomClusterInput({ activeSuffix, active }: InputProps) {
  const { customUrl } = useCluster();
  const updateCustomUrl = useUpdateCustomUrl();
  const [editing, setEditing] = React.useState(false);
  const query = useQuery();
  const history = useHistory();
  const location = useLocation();

  const customClass = (prefix: string) =>
    active ? `${prefix}-${activeSuffix}` : "";

  const clusterLocation = (location: Location) => {
    if (customUrl.length > 0) {
      query.set("cluster", "custom");
      query.set("customUrl", customUrl);
    }
    return {
      ...location,
      search: query.toString(),
    };
  };

  const onUrlInput = useDebounceCallback((url: string) => {
    updateCustomUrl(url);
    if (url.length > 0) {
      query.set("cluster", "custom");
      query.set("customUrl", url);
      history.push({ ...location, search: query.toString() });
    }
  }, 500);

  return (
    <>
      <Button component={Link}
        variant="outlined"
        to={(location: any) => clusterLocation(location)}
        className={`align-left ${active?'active':''}`}
        disableRipple
      >
        <div className="input-group-prepend">
          <div className={`input-group-text pr-3 ${customClass("border")}`}>
            <span className={customClass("text") || ""}>Custom:</span>
          </div>
        </div> 
        <input
          type="text"
          defaultValue={customUrl}
          className={`bg-transparent w-full focus:outline-none`}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onInput={(e) => onUrlInput(e.currentTarget.value)}
        />
        
      </Button>
    </>
  );
}

function ClusterToggle() {
  const { status, cluster, customUrl } = useCluster();

  let activeSuffix = "";
  switch (status) {
    case ClusterStatus.Connected:
      activeSuffix = "primary";
      break;
    case ClusterStatus.Connecting:
      activeSuffix = "primary";
      break;
    case ClusterStatus.Failure:
      activeSuffix = "danger";
      break;
    default:
      assertUnreachable(status);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {CLUSTERS.map((net, index) => {
        const active = net === cluster;
        if (net === Cluster.Custom)
          return (
            <CustomClusterInput
              key={index}
              activeSuffix={activeSuffix}
              active={active}
            />
          );

        const clusterLocation = (location: Location) => {
          const params = new URLSearchParams(location.search);
          const slug = clusterSlug(net);
          if (slug !== "mainnet-beta") {
            params.set("cluster", slug);
          } else {
            params.delete("cluster");
          }
          return {
            ...location,
            search: params.toString(),
          };
        };

        return (
          <>
            <Button component={Link} variant="outlined" to={clusterLocation} className={`align-left ${active?'active':''}`}>
              {`${clusterName(net)}: `}
              <span className="text-secondary ml-2">
                {clusterUrl(net, customUrl).replace("explorer-", "")}
              </span>
            </Button>
            {/* <Link
              key={index}
              className={`btn text-left col-12 mb-3 ${btnClass}`}
              to={clusterLocation}
            >
            </Link> */}
          </>
        );
      })}
    </div>
  );
}
