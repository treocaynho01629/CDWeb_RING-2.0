import React, { Suspense } from 'react';
import CustomProgress from '../custom/CustomProgress';

export const Loader = () => {
  return (
    <div style={{ postion: 'absolute', width: '100%', height: '100dvh', marginTop: '-40px', top: 0, start: 0, zIndex: 999 }}>
      <CustomProgress />
    </div>
  );
};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;