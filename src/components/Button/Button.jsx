import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
    style = {},
    variant = 'primary',
    size,
    ...rest
}) => {
    const sizeClass = size ? `btn-${size}` : '';
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} ${sizeClass} ${className}`}
            style={style}
            {...rest}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    variant: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'lg']),
};

export default Button;