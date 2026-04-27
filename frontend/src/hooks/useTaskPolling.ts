import { useQuery } from "@tanstack/react-query";

import { getTask } from "../api/tasks";

export function useTaskPolling(taskId: number, enabled = true) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
    enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "success" || status === "failed" ? false : 2000;
    },
  });
}
