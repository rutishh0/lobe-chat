import { Theme, css } from 'antd-style';

export default ({ token }: { prefixCls: string; token: Theme }) => css`
  // Override Ant Design components with Elevate theme
  .${token.prefixCls}-btn {
    background: #7C3AED;
    border-color: transparent;
    border-radius: 8px;
    color: white;
    height: 40px;
    padding: 0 20px;
    font-weight: 500;
    transition: background-color 0.2s;

    &:hover {
      background: #6D28D9 !important;
      border-color: transparent !important;
      color: white !important;
    }

    &-primary {
      background: #7C3AED;
      
      &:hover {
        background: #6D28D9;
      }
    }

    &-default {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }
  }

  .${token.prefixCls}-input {
    background: #111111;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: white;

    &:focus, &:hover {
      border-color: #7C3AED;
      box-shadow: none;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .${token.prefixCls}-select {
    &-selector {
      background: #111111 !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      border-radius: 8px !important;
    }

    &-selection-item {
      color: white !important;
    }

    &-arrow {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .${token.prefixCls}-modal {
    &-content {
      background: #111111;
      border-radius: 12px;
    }

    &-header {
      background: #111111;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    }

    &-title {
      color: white;
    }

    &-close {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .${token.prefixCls}-popover {
    z-index: 1100;
    background: #1A1A1A;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;

    &-inner {
      background: #1A1A1A;
    }

    &-arrow {
      &:before {
        background: #1A1A1A;
      }
    }
  }

  .${token.prefixCls}-menu {
    background: #111111;
    color: white;

    &-item {
      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }

      &-selected {
        background: #7C3AED !important;
        color: white !important;
      }
    }

    &-sub.${token.prefixCls}-menu-vertical {
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: #1A1A1A;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
  }
`;
