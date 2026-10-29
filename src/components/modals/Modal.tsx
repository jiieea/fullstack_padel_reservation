import type { CSSProperties, ReactNode } from 'react';

export function Modal({ children, boxStyle }: { children: ReactNode; boxStyle?: CSSProperties }) {
  return (
    <div className="modal on" role="dialog" aria-modal="true">
      <div className="box" style={boxStyle}>{children}</div>
    </div>
  );
}
