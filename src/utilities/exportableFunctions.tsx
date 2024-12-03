import {
  Blockchain,
  PersistedDataOnRedirection,
  PersistedDataOnRedirectionMethodName,
} from '@/contexts/GlobalContext';

export function smartTrim(string: string, maxLength: number) {
  if (!string) return string;
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength == 1) return string.substring(0, 1) + '...';

  var midpoint = Math.ceil(string.length / 2);
  var toremove = string.length - maxLength;
  var lstrip = Math.ceil(toremove / 2);
  var rstrip = toremove - lstrip;
  return (
    string.substring(0, midpoint - lstrip) +
    '...' +
    string.substring(midpoint + rstrip)
  );
}

export function addEncodedDataToURL(
  blockchain: Blockchain,
  methodName: PersistedDataOnRedirectionMethodName
) {
  const dataToPersist: PersistedDataOnRedirection = {
    blockchain,
    methodName,
  };
  const encodedData = encodeURIComponent(JSON.stringify(dataToPersist));

  const url = new URL(window.location.href);
  url.searchParams.set('data', encodedData);

  window.history.replaceState({}, document.title, url.toString());
}

export function getDataFromURL(urlParams: URLSearchParams) {
  const transactionHashes = urlParams.get('transactionHashes');
  const errorCode = urlParams.get('errorCode');
  const persistedData = JSON.parse(
    decodeURIComponent(urlParams.get('data') || '{}')
  ) as PersistedDataOnRedirection;

  return { transactionHashes, errorCode, persistedData };
}
