import { useEffect } from 'react';

export const useAsync = (
  asyncFn,
  successFunction,
  returnFunction,
  errorFunction,
  dependencies = []
) => {
  useEffect(() => {
    let isActive = true;
    asyncFn().then((result) => {
      if (isActive) successFunction(result.data);
    })
    .catch((error)=> {
      if (isActive) errorFunction && errorFunction(error);
    });
    return () => {
      returnFunction && returnFunction();
      isActive = false;
    };
  }, dependencies);
};