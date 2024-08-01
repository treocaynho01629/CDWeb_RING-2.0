import { Suspense } from 'react';
import CustomProgress from '../custom/CustomProgress';

export const Loader = () => {
  return (
    <div style={{ postion: 'fixed', width: '100%', height: '100dvh', padding: 0, top: 0, left: 0, zIndex: 999 }}>
      <CustomProgress color={"secondary"}/>
    </div>
  );
};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;