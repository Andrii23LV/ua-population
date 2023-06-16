import React from "react";
import { useSpring, animated } from "react-spring";

interface ChoroplethMapProps {
    n: number;
}

const Number: React.FC<ChoroplethMapProps> = ({ n }) => {
    const { number } = useSpring({
        from: { number: 0 },
        to: { number: n },
        delay: 300,
        config: { mass: 1, tension: 20, friction: 5 },
    })
    return <animated.div>{number.to((n) => n.toFixed(0))}</animated.div>;
};

export default Number;
