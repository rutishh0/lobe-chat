import { Theme, css } from 'antd-style';

// fix ios input keyboard
// overflow: hidden;
// ref: https://zhuanlan.zhihu.com/p/113855026
export default ({ token }: { prefixCls: string; token: Theme }) => css`
  html,
  body,
  #__next {
    position: relative;
    overscroll-behavior: none;
    height: 100%;
    min-height: 100dvh;
    max-height: 100dvh;
    background: #000000;
    color: #FFFFFF;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;

    @media (min-device-width: 576px) {
      overflow: hidden;
    }
  }

  // Add gradient text utility classes
  .gradient-text-blue {
    background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-text-purple {
    background: linear-gradient(90deg, #7C3AED 0%, #6D28D9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  * {
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
    scrollbar-width: thin;

    ::-webkit-scrollbar {
      width: 0.75em;
      height: 0.75em;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
    }

    :hover::-webkit-scrollbar-thumb {
      border: 3px solid transparent;
      background-color: rgba(255, 255, 255, 0.3);
      background-clip: content-box;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  // Style buttons
  button {
    background: #7C3AED;
    border-radius: 8px;
    color: white;
    transition: background-color 0.2s;

    &:hover {
      background: #6D28D9;
    }
  }

  // Style inputs
  input, textarea {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: white;

    &:focus {
      border-color: #7C3AED;
      outline: none;
    }
  }
`;
