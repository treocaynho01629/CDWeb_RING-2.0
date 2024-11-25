import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigation } from 'react-router';
import CustomProgress from '../custom/CustomProgress';

const fillSpeed = 800;
const trickleSpeed = 200;
const minimum = 8;

//These code I ripped straight out of NProgress source code
function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

const LoadingProgress = () => {
    const { pathname } = useLocation();
    const navigation = useNavigation();
    const status = useRef(null);
    const [progress, setProgress] = useState(null);

    useEffect(() => { //Reset progress after completed
        if (progress == 100) {
            const timeout = setTimeout(() => {
                setProgress(null)
            }, fillSpeed)

            return () => clearTimeout(timeout)
        }
    }, [progress])

    useLayoutEffect(() => { //Display when loading page's content
        if (navigation.state == "loading" || navigation.state == "submitting") start();
        if (navigation.state == "idle") done();
    }, [navigation.state])

    //Display when changing path
    useLayoutEffect(() => { start(); }, [pathname]);
    useEffect(() => { done();  }, [pathname]);

    const setValue = useCallback((n) => {
        n = clamp(n, minimum, 100);
        let newValue = (n === 100 ? null : n);
        status.current = newValue;

        if (n === 100) { //Set progress bar's state
            setProgress(100);
        } else {
            setProgress(newValue);
        }
    }, [])

    const start = useCallback(() => {
        if (!status.current) setValue(0);

        var work = function () {
            setTimeout(function () {
                if (!status.current) return;
                trickle();
                work();
            }, trickleSpeed);
        };

        if (true) work();

        return this;
    }, [])

    const done = useCallback((force) => {
        if (!force && !status.current) return this;
        increase(30 + 50 * Math.random() * 100); //Quickly fill up then 100
        return setValue(100);
    }, []);

    const increase = useCallback((amount) => { //Increase random amount
        let n = status.current;

        if (!n) {
            return start();
        } else if (n > 100) {
            return;
        } else { //Progressively faster
            if (amount == null) {
                if (n >= 0 && n < 20) { amount = 10; }
                else if (n >= 20 && n < 50) { amount = 4; }
                else if (n >= 50 && n < 80) { amount = 2; }
                else if (n >= 80 && n < 99) { amount = 0.5; }
                else { amount = 0; }
            }

            n = clamp(n + amount, 0, 99.4); //Cap at 99.4
            return setValue(n);
        }
    }, [])

    const trickle = useCallback(() => { return increase(); }, []);

    if (progress) return (
        <div style={{ position: 'fixed', width: '100%', top: 0, left: 0, zIndex: 1200 }}>
            <CustomProgress color="primary" variant="determinate" value={progress} />
        </div>
    )
}

export default LoadingProgress