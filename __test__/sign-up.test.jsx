import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from '../src/app/sign-up/page';

describe('회원가입 테스트', () => {
  test('회원가입 페이지 각 라벨 렌더링', () => {
    // given
    render(<SignUp />);

    // when
    const inputIdElement = screen.getByLabelText('Id');
    const inputPwElement = screen.getByLabelText('passWord');
    const inputPwConfirmElement = screen.getByLabelText('passWordConfirm');

    // then
    expect(inputIdElement).toBeInTheDocument();
    expect(inputPwElement).toBeInTheDocument();
    expect(inputPwConfirmElement).toBeInTheDocument();
  });

  test('비밀번호 일치 여부 테스트', () => {
    render(<SignUp />);

    const idInput = screen.getByLabelText('Id');
    const pwInput = screen.getByLabelText('passWord');
    const pwConfirmInput = screen.getByLabelText('passWordConfirm');
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Enter valid inputs
    fireEvent.change(idInput, { target: { value: 'testuser' } });
    fireEvent.change(pwInput, { target: { value: 'password123' } });
    fireEvent.change(pwConfirmInput, { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Error message should not be displayed
    const errorMsg = screen.queryByText('비밀번호가 일치하지 않습니다.');
    expect(errorMsg).not.toBeInTheDocument();

    const successMsg = screen.queryByText('회원가입이 완료되었습니다.');
    expect(successMsg).toBeInTheDocument();
  });

  test('비밀번호 불일치 여부 테스트', () => {
    render(<SignUp />);

    const idInput = screen.getByLabelText('Id');
    const pwInput = screen.getByLabelText('passWord');
    const pwConfirmInput = screen.getByLabelText('passWordConfirm');
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Enter valid id and passwords, but confirm password different
    fireEvent.change(idInput, { target: { value: 'testuser' } });
    fireEvent.change(pwInput, { target: { value: 'password123' } });
    fireEvent.change(pwConfirmInput, { target: { value: 'differentpassword' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Error message should be displayed
    const errorMsg = screen.getByText('비밀번호가 일치하지 않습니다.');
    expect(errorMsg).toBeInTheDocument();
  });
});
