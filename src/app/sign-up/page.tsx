'use client';

import { styled } from '@stitches/react';
import { useMemo, useState } from 'react';

const SignUp = () => {
  const [id, setId] = useState('');
  const [passWord, setPassWord] = useState('');
  const [passWordConfirm, setPassWordConfirm] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passWord !== passWordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSuccess(true);
  };

  const isDisabled = useMemo(() => {
    return (
      !id ||
      id.trim() === '' ||
      !passWord ||
      passWord.trim() === '' ||
      !passWordConfirm ||
      passWordConfirm.trim() === ''
    );
  }, [id, passWord, passWordConfirm]);

  return (
    <form onSubmit={onSubmit}>
      <Flex>
        <CustomLabel htmlFor='id'>Id</CustomLabel>
        <input type='text' id='id' name='id' value={id} onChange={(e) => setId(e.target.value)} />
      </Flex>

      <Flex>
        <CustomLabel htmlFor='passWord'>passWord</CustomLabel>
        <input
          type='password'
          id='passWord'
          name='passWord'
          value={passWord}
          onChange={(e) => setPassWord(e.target.value)}
        />
      </Flex>

      <Flex>
        <CustomLabel htmlFor='passWordConfirm'>passWordConfirm</CustomLabel>
        <input
          type='password'
          id='passWordConfirm'
          name='passWordConfirm'
          value={passWordConfirm}
          onChange={(e) => setPassWordConfirm(e.target.value)}
        />
      </Flex>

      <CustomSpan>{errorMsg}</CustomSpan>
      {isSuccess && <CustomSpan>회원가입이 완료되었습니다.</CustomSpan>}

      <div>
        <button type='submit' disabled={isDisabled}>
          register
        </button>
      </div>
    </form>
  );
};

export default SignUp;

const CustomLabel = styled('label', {
  display: 'block',
  width: '150px',
});

const CustomSpan = styled('p', {
  color: 'red',
  marginBottom: 10,
});

const Flex = styled('div', {
  display: 'flex',
  gap: 10,
  marginBottom: 10,
});
