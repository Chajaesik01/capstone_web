import { colors } from '@/styles';
import React from 'react';
import styled from 'styled-components';
type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  fSize?: string;
};

type ButtonStyledProps = {
  $width: string;
  $height: string;
  $fSize: string;
};
const Button = ({
  type,
  width,
  height,
  onClick,
  children,
  disabled,
  fSize,
}: ButtonProps) => {
  return (
    <S.ButtonContainer
      $width={width || '100%'}
      $height={height || '100%'}
      $fSize={fSize || '16px'}
    >
      <button onClick={onClick} disabled={disabled} type={type || 'button'}>
        {children}
      </button>
    </S.ButtonContainer>
  );
};

const S = {
  ButtonContainer: styled.div<ButtonStyledProps>`
    width: ${(props) => props.$width};
    height: ${(props) => props.$height};
    font-size: ${(props) => props.$fSize};

    button {
      width: 100%;
      height: 100%;
      border: 0.5px solid gray;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 8px 12px;
      outline: none;
      cursor: pointer;
      background-color: ${colors.semantic.primary};

      &:hover {
        background-color: ${colors.semantic.hover.primary};
      }
    }
  `,
};

export default Button;
