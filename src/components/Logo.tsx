import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> { }

export const Logo: React.FC<LogoProps> = (props) => (
    <svg
        viewBox="0 0 120 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M2.5 2.5H117.5V30.5C117.5 30.5 105 37.5 90 37.5C75 37.5 70 30.5 60 30.5C50 30.5 45 37.5 30 37.5C15 37.5 2.5 30.5 2.5 30.5V2.5Z"
            fill="white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
        />
        <text
            x="60"
            y="24"
            fontFamily="sans-serif"
            fontSize="16"
            fontWeight="900"
            fill="currentColor"
            textAnchor="middle"
            letterSpacing="0.5"
        >
            YOUTH
        </text>
    </svg>
);

export default Logo;
