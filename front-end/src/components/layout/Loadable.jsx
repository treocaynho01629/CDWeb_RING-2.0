import { Suspense } from 'react';
import CustomProgress from '../custom/CustomProgress';

export const Loader = () => {
  return (
    <>
      <div style={{ position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1200 }}>
        <CustomProgress color="primary" />
      </div>
      <div style={{ height: '70dvh' }} />
    </>
  );
};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;