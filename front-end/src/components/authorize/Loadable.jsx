import React, { Suspense } from 'react';
import { styled as muiStyled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

const CustomLinearProgress = muiStyled(LinearProgress)(({ theme }) => ({
    borderRadius: 0,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: 'lightgray',
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 0,
        backgroundColor: '#63e399',
    },
}));

export const Loader = () => {
  return (
    <div style={{postion: 'absolute', width: '100%', height: '500px', marginTop: '-40px', top: 0, start: 0, zIndex: 999}}>
      <CustomLinearProgress/>
    </div>
  );
};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;