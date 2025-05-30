import styled from 'styled-components';

type InputProps = {
  selectType?: string;
  text?: string;
  placeholder?: string;
  width?: string;
  height?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: {
    message?: string;
    type?: string;
  };
  disabled?: boolean;
  name?: string;
  id?: string;
};

type InputStyledProps = {
  $width: string;
  $height: string;
  $hasError?: boolean;
};

const Input = ({
  selectType = 'text',
  text,
  placeholder = '',
  width = '100%',
  height = '50%',
  value,
  onChange,
  error,
  disabled = false,
  name,
  id,
}: InputProps) => {
  const Itype = selectType || 'text';
  const Iplaceholder = placeholder || '';

  return (
    <div>
      <S.InputContainer $width={width} $height={height} $hasError={!!error}>
        <input
          type={Itype}
          name={name}
          id={id}
          placeholder={Iplaceholder}
          defaultValue={text}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </S.InputContainer>

      {error && error.message && (
        <S.ErrorMessage>⚠️ {error.message}</S.ErrorMessage>
      )}
    </div>
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

  ErrorMessage: styled.span`
    color: #ef4444;
    font-size: 12px;
    display: block;
    margin-bottom: 0;
  `,
};

export default Input;
