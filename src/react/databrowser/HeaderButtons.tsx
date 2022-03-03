import React, { useMemo } from 'react';
import { matchPath, useLocation, useParams } from 'react-router-dom';
import { Button } from '@scality/core-ui/dist/next';
import { ButtonsContainer } from '../ui-elements/Container';
import { listBuckets } from '../actions/s3bucket';
import { listObjects } from '../actions/s3object';
import { useDispatch } from 'react-redux';
export function RefreshButton() {
  const { bucketName } = useParams();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const isBrowsingObjects = !!matchPath(
    pathname,
    '/buckets/:bucketName/objects',
  );
  const prefixWithSlash = useMemo(() => {
    const splittedPath = pathname.split('objects/');

    if (splittedPath.length < 2 || splittedPath[1].length === 0) {
      return '';
    } else {
      const prefix =
        splittedPath[1].slice(-1) === '/'
          ? splittedPath[1]
          : `${splittedPath[1]}/`;
      return prefix;
    }
  }, [pathname]);

  const handleRefreshClick = () => {
    if (isBrowsingObjects) {
      dispatch(listObjects(bucketName, prefixWithSlash));
    } else {
      dispatch(listBuckets());
    }
  };

  return (
    <Button icon={<i className="fas fa-sync" />} onClick={handleRefreshClick} />
  );
}
export default function Buttons() {
  return (
    <ButtonsContainer>
      <RefreshButton />
    </ButtonsContainer>
  );
}