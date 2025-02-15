import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ComponentProps, FC, MouseEventHandler } from "react";
import { SAVED_TICKER_LIST_KEY } from "..";
import { api_removeTicker, api_saveTicker } from "../api";

interface Props extends ComponentProps<"button"> {
  ticker: string;
  is_saved: boolean;
}

const SaveButton: FC<Props> = (props) => {
  const { is_saved, ticker, onClick, ...rest } = props;

  const query_client = useQueryClient();

  const handleSuccess = () => {
    query_client.invalidateQueries({ queryKey: SAVED_TICKER_LIST_KEY });
  };

  const handleError = (error: Error) => {
    console.error(error);
    alert("저장에 실패했습니다.");
  };

  const { mutate: save } = useMutation({
    mutationFn: async () => {
      api_saveTicker(ticker);
    },
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const { mutate: remove } = useMutation({
    mutationFn: async () => api_removeTicker(ticker),
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    is_saved ? remove() : save();
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} {...rest}>
      {is_saved ? "저장 해제" : "저장"}
    </button>
  );
};

export { SaveButton };

