import SignIn from '@/app/sign-in/page';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { defaultAxios } from '../config/axiosConfig';
import { AxiosError } from 'axios';

jest.mock('../config/axiosConfig.ts');

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testData = {
    validEmail: 'bowow@eazel.net',
    validPassword: 'eazel1!',
    invalidEmail: 'invalidEmail@test.com',
    invalidPassword: 'invalidPassword',
  };

  const renderSignInComponent = () => {
    // given
    render(<SignIn />);

    // when
    const idInputNode = screen.getByLabelText('Id');
    const passwordInputNode = screen.getByLabelText('passWord');
    const loginButtonNode = screen.getByText('login');
    const resetButtonNode = screen.getByText('reset');

    return { idInputNode, passwordInputNode, loginButtonNode, resetButtonNode };
  };

  it('renders without crashing', () => {
    // given, when
    const { idInputNode, loginButtonNode, passwordInputNode, resetButtonNode } =
      renderSignInComponent();

    // then
    expect(idInputNode).toBeTruthy();
    expect(passwordInputNode).toBeTruthy();
    expect(loginButtonNode).toBeTruthy();
    expect(resetButtonNode).toBeTruthy();
  });

  describe('Ensure signIn params correct', () => {
    it('should call sign in with axios and return success', async () => {
      // given, when
      const { idInputNode, loginButtonNode, passwordInputNode } = renderSignInComponent();

      // when (more condition)
      fireEvent.change(idInputNode, { target: { value: testData.validEmail } });
      fireEvent.change(passwordInputNode, { target: { value: testData.validPassword } });
      fireEvent.click(loginButtonNode);

      // then
      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email: testData.validEmail,
          password: testData.validPassword,
        })
      );
      expect(defaultAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('Check response "로그인 왼료되었습니다."', () => {
    beforeAll(() => {
      defaultAxios.post = jest.fn().mockResolvedValue({});
    });

    it('should show success 로그인이 완료되었습니다', async () => {
      const { idInputNode, passwordInputNode, loginButtonNode } = renderSignInComponent();

      fireEvent.change(idInputNode, { target: { value: testData.validEmail } });
      fireEvent.change(passwordInputNode, { target: { value: testData.validPassword } });
      fireEvent.click(loginButtonNode);

      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email: testData.validEmail,
          password: testData.validPassword,
        })
      );
      const succesMsg = await screen.findByText('로그인이 완료되었습니다.');

      expect(succesMsg).toBeTruthy();
    });
  });

  describe('Check response "로그인이 실패되었습니다"', () => {
    const errorMessage = '로그인이 실패되었습니다';

    beforeAll(() => {
      const axiosError: AxiosError = new AxiosError(errorMessage, '401', undefined, undefined, {
        data: { message: errorMessage },
        status: 401,
        statusText: '',
        headers: {},
        config: {} as any,
        request: undefined,
      });

      defaultAxios.post = jest.fn().mockRejectedValue(axiosError);
    });

    it(`should show success ${errorMessage}`, async () => {
      // given
      const { idInputNode, passwordInputNode, loginButtonNode } = renderSignInComponent();

      // when
      fireEvent.change(idInputNode, { target: { value: testData.invalidEmail } });
      fireEvent.change(passwordInputNode, { target: { value: testData.invalidPassword } });
      fireEvent.click(loginButtonNode);

      // then
      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email: testData.invalidEmail,
          password: testData.invalidPassword,
        })
      );

      const failMessage = await screen.findByText(errorMessage);
      expect(failMessage).toBeTruthy();
    });
  });

  describe('Check response "something went wrong."', () => {
    const errorMessage = 'something went wrong.';
    it(`should display ${errorMessage}`, async () => {
      const error: AxiosError = {
        isAxiosError: true,
        config: undefined,
        name: 'Error',
        message: 'Unknown Error',
        toJSON: () => ({}),
      };

      (defaultAxios.post as jest.Mock).mockRejectedValue(error);

      // given
      const { idInputNode, passwordInputNode, loginButtonNode } = renderSignInComponent();

      // when
      fireEvent.change(idInputNode, { target: { value: testData.validEmail } });
      fireEvent.change(passwordInputNode, { target: { value: testData.invalidPassword } });
      fireEvent.click(loginButtonNode);

      // then
      const data = expect(await screen.findByText(errorMessage));
      expect(data).toBeTruthy();
    });
  });

  describe('Check response "알 수 없는 에러가 발생했습니다."', () => {
    const errorMessage = '알 수 없는 에러가 발생했습니다.';
    it(`should display ${errorMessage}`, async () => {
      (defaultAxios.post as jest.Mock).mockImplementation(() => {
        throw new Error('Unknown Error');
      });

      const { idInputNode, passwordInputNode, loginButtonNode } = renderSignInComponent();

      fireEvent.change(idInputNode, { target: { value: testData.invalidEmail } });
      fireEvent.change(passwordInputNode, { target: { value: testData.invalidPassword } });
      fireEvent.click(loginButtonNode);

      const data = expect(await screen.findByText(errorMessage));
      expect(data).toBeTruthy();
    });
  });
});
