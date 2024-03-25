// FILEPATH: /Users/eazel/junhee/junhee-test/src/app/sign-in/page.test.tsx
import SignIn from '@/app/sign-in/page';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { defaultAxios } from '../config/axiosConfig';
import { AxiosError } from 'axios';

// no featured exhibttionsn case -> api.exhibitions.featured.mockResolvedValue([]);
// 1 featured exhibttionsn case -> api.exhibitions.featured.mockResolvedValue([<ExhibitionPreview>]);

/**
 * beforeAll/beforeEach - runs before describe()
 * afterAll/afterEach - runs after describe()
 * beforeEach -> runs before each child describe()
 * afterEach -> runs after each child describe()
 * it -> has to pass all expect() -> success ELSE fail
 */
jest.mock('../config/axiosConfig.ts');

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders without crashing', () => {
    render(<SignIn />);
  });

  describe('Ensure signIn params correct', () => {
    it('should call sign in with axios and return success', async () => {
      const email = 'bowow@eazel.net';
      const password = 'eazel1!';

      const { getByLabelText, getByText } = render(<SignIn />);
      fireEvent.change(getByLabelText('Id'), { target: { value: email } });
      fireEvent.change(getByLabelText('passWord'), { target: { value: password } });
      fireEvent.click(getByText('login'));

      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email,
          password,
        })
      );
      expect(defaultAxios.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('Check 로그인 왼료되었습니다', () => {
    beforeAll(() => {
      defaultAxios.post = jest.fn().mockResolvedValue({});
    });

    it('should show success 로그인이 완료되었습니다', async () => {
      const email = 'anyemail';
      const password = 'anypassword';
      const { getByLabelText, getByText } = render(<SignIn />);
      fireEvent.change(getByLabelText('Id'), { target: { value: email } });
      fireEvent.change(getByLabelText('passWord'), { target: { value: password } });
      fireEvent.click(getByText('login'));
      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email,
          password,
        })
      );
      const succesMsg = await screen.findByText('로그인이 완료되었습니다.');

      expect(succesMsg).toBeTruthy();
    });
  });

  describe('Check response error 로그인이 실패되었습니다', () => {
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
      const email = 'anyemail';
      const password = 'anypassword';
      const { getByLabelText, getByText } = render(<SignIn />);

      fireEvent.change(getByLabelText('Id'), { target: { value: email } });
      fireEvent.change(getByLabelText('passWord'), { target: { value: password } });
      fireEvent.click(getByText('login'));

      await waitFor(() =>
        expect(defaultAxios.post).toHaveBeenCalledWith('/v1/users/sign-in', {
          email,
          password,
        })
      );

      const failMessage = await screen.findByText(errorMessage);
      expect(failMessage).toBeTruthy();
    });
  });

  describe('Check response something went wrong.', () => {
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

      const { getByLabelText, getByText } = render(<SignIn />);

      fireEvent.change(getByLabelText('Id'), { target: { value: 'testId' } });
      fireEvent.change(getByLabelText('passWord'), { target: { value: 'testPassword' } });
      fireEvent.click(getByText('login'));

      const data = expect(await screen.findByText(errorMessage));
      expect(data).toBeTruthy();
    });
  });

  describe('Check response 알 수 없는 에러가 발생했습니다.', () => {
    const errorMessage = '알 수 없는 에러가 발생했습니다.';
    it(`should display ${errorMessage}`, async () => {
      (defaultAxios.post as jest.Mock).mockImplementation(() => {
        throw new Error('Unknown Error');
      });

      const { getByLabelText, getByText } = render(<SignIn />);

      fireEvent.change(getByLabelText('Id'), { target: { value: 'testId' } });
      fireEvent.change(getByLabelText('passWord'), { target: { value: 'testPassword' } });
      fireEvent.click(getByText('login'));

      const data = expect(await screen.findByText(errorMessage));
      expect(data).toBeTruthy();
    });
  });
});
