'use client';

import { styled } from '@stitches/react';
import { useCallback, useMemo, useState } from 'react';
import { defaultAxios } from '../../../config/axiosConfig';
import { isAxiosError } from 'axios';

const signIn = async (body: { email: string; password: string }): Promise<void> => {
  await defaultAxios.post('/v1/users/sign-in', body);
  return;
};

const SignIn = () => {
  const [id, setId] = useState('');
  const [passWord, setPassWord] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (errorMsg) {
        setErrorMsg('');
      }

      if (isSuccess) {
        setIsSuccess(false);
      }

      try {
        await signIn({ email: id, password: passWord });

        setIsSuccess(true);
      } catch (e: unknown) {
        if (isAxiosError(e)) {
          console.error('is axios error');
          setErrorMsg(e?.response?.data?.message || 'something went wrong.');
          return;
        }

        console.error('error occurred in onsubmit event, not the axios error');
        setErrorMsg('알 수 없는 에러가 발생했습니다.');
      }
    },
    [errorMsg, id, isSuccess, passWord]
  );

  const clearData = useCallback(() => {
    setId('');
    setPassWord('');
    setErrorMsg('');
    setIsSuccess(false);
  }, []);

  const isDisabled = useMemo(() => {
    return !id || id.trim() === '' || !passWord || passWord.trim() === '';
  }, [id, passWord]);

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

      <CustomSpan id='error-msg'>{errorMsg}</CustomSpan>
      {isSuccess && <CustomSpan>로그인이 완료되었습니다.</CustomSpan>}

      <Flex>
        <button type='submit' disabled={isDisabled}>
          login
        </button>

        <button type='button' onClick={clearData}>
          reset
        </button>
      </Flex>
    </form>
  );
};

export default SignIn;

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
