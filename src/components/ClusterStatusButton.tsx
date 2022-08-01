import React from "react";
import {
  useCluster,
  ClusterStatus,
  Cluster,
  useClusterModal,
} from "providers/cluster";
import { LoadingButton } from "@mui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-regular-svg-icons";

export function ClusterStatusBanner() {
  const [, setShow] = useClusterModal();

  return (
    <div className="container d-md-none my-4">
      <div onClick={() => setShow(true)}>
        <Button />
      </div>
    </div>
  );
}

export function ClusterStatusButton() {
  const [, setShow] = useClusterModal();

  return (
    <div onClick={() => setShow(true)}>
      <Button />
    </div>
  );
}

function Button() {
  const { status, cluster, name, customUrl } = useCluster();
  const statusName = cluster !== Cluster.Custom ? `${name}` : `${customUrl}`;

  return (
    <LoadingButton
      disableRipple
      variant="contained"
      size="small"
      loading={status===ClusterStatus.Connecting}
      loadingPosition="start"
      startIcon={<FontAwesomeIcon icon={status===ClusterStatus.Failure?faCircleXmark:faCircleCheck} />}
    >
      {statusName}
    </LoadingButton>
  );
}
