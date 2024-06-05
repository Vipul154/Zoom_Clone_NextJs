import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id: string | string[]) => {
  const [call, setCall] = useState<Call | undefined>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();
  // Getting access to the stream video client

  // Defining a useEffect to start fetching our currently active call
  useEffect(() => {
    if (!client) return;

    const loadCall = async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: {
          id,
        },
      });

      if (calls.length > 0) setCall(calls[0]);
      setIsCallLoading(false);
    };
    loadCall();

    // Why declare and call it? Because this function is an async function and we cannot write regular async await code within a useEffect unless we declare it as a new function.
    // Now we need to query the call, using filters on id, cid, team, type, etc. based on docs.
  }, [client, id]);
  // whenever the client changes or the id of the call changes
  return { call, isCallLoading };
};
