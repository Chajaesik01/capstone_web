import styled from 'styled-components';

type InputProps = {
  selectType?: string;
  text?: string;
  placeholder?: string;
  width?: string;
  height?: string;
};

type InputStyledProps = {
  $width: string;
  $height: string;
};

const Input = ({
  selectType,
  text,
  placeholder,
  width,
  height,
}: InputProps) => {
  const Itype = selectType || 'text';
  const Itext = text || '';
  const Iplaceholder = placeholder || '';

  return (
    <S.InputContainer $width={width || '100%'} $height={height || '50%'}>
      <input type={Itype} placeholder={Iplaceholder} defaultValue={Itext} />
    </S.InputContainer>
  );
};

const S = {
  InputContainer: styled.div<InputStyledProps>`
    width: ${(props) => props.$width};
    height: ${(props) => props.$height};

    input {
      width: 100%;
      height: 100%;
      border: 0.5px solid gray;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 8px 12px;
      outline: none;
    }
  `,
};

export default Input;
