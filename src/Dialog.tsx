import React, { useState, useEffect, useReducer, useCallback, CSSProperties } from 'react';

interface Property {
  id: string
  name: string
  style: CSSProperties
  top: number
  left: number
  width: number
  height: number
  hidden?: boolean
  onClose: (dialogId: string) => void
  onMinimize: (dialogId: string) => void
}

let incrementIndex = 10;

interface State {
  x: number
  y: number
  top: number
  left: number
  width: number
  height: number
  zIndex: number
  selected: boolean
  max: boolean
  icon: {
    hover: boolean,
  },
  dragging: boolean
}

type Action = (
  | ReturnType<typeof dragStart>
  | ReturnType<typeof drag>
  | ReturnType<typeof mouseup>
  | ReturnType<typeof hover>
  | ReturnType<typeof showTop>
  | ReturnType<typeof maximize>
)

const dragStart = (x: number, y: number) => {
  return {
    type: 'drag_start' as const,
    x,
    y,
  }
}

const drag = (x: number, y: number) => {
  return {
    type: 'drag' as const,
    x,
    y,
  }
}

const mouseup = () => {
  return {
    type: 'mouseup' as const,
  }
}

const hover = (hover: boolean) => {
  return {
    type: 'hover' as const,
    hover,
  }
}

const showTop = () => {
  return {type: 'show_top' as const}
}

const maximize = () => {
  return {type: 'maximize' as const}
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'drag_start':
      return {
        ...state,
        x: action.x,
        y: action.y,
        dragging: true,
        zIndex: incrementIndex++
      }
    case 'drag':
      if (state.dragging) {
        return {
          ...state,
          x: action.x,
          y: action.y,
          top: state.top + action.y - state.y,
          left: state.left + action.x - state.x,
        }
      }
      return state;
    case 'mouseup':
      if (state.dragging) {
        return {
          ...state,
          dragging: false,
        }
      }
      return state;
    case 'hover':
      return {
        ...state,
        icon: {
          hover: action.hover,
        },
      }
    case 'show_top':
      return {
        ...state,
        zIndex: incrementIndex++
      }
    case 'maximize':
      return {
        ...state,
        max: !state.max,
      }
    default:
      console.log(action);
      throw new Error();
  }
}

const Dialog: React.FC<Property> = ({ children, style, id, hidden, name, top, left, width, height, onClose, onMinimize}) => {
  const [state, dispatch] = useReducer(reducer, {
    x: 0,
    y: 0,
    top,
    left,
    width,
    height,
    zIndex: incrementIndex,
    selected: false,
    max: false,
    icon: {
      hover: false,
    },
    dragging: false,
  })
  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      dispatch(drag(e.clientX, e.clientY))
    }
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])
  const onClick = useCallback((e: React.MouseEvent) => {
    dispatch(showTop())
  }, []);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(dragStart(e.clientX, e.clientY))
  }, [])
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(mouseup())
  }, [])
  const onMouseEnter = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(hover(true))
  }, [])
  const onMouseLeave = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(hover(false))
  }, [])
  const onDialogClose = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onClose(id);
  }, [onClose])
  const onMaximize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(maximize());
  }, [])
  const onDialogMinimize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    onMinimize(id)
  }, [onMinimize])
  return (
    <div id={id} 
      style={{
        ...style,
        // display: (hidden ? 'none' : 'block'),
        left: state.max ? 0 : state.left,
        top: state.max ? 0 : state.top,
        width: state.max ? '100%' : state.width,
        height: state.max ? '100%' : state.height,
        zIndex: state.zIndex,
        resize: 'both',
        overflow: 'auto',
      }}
      className={'dialog' + (state.dragging ? ' dialog-selected' : '') + (hidden ? ' hidden' : '')}
      onClick={onClick}
      >
      <div className={'title-bar' + (state.icon.hover ? ' hover' : '')} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <div className="icons" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div className="dialog-close dialog-icon" onClick={onDialogClose}></div>
          <div className="dialog-min dialog-icon" onClick={onDialogMinimize}></div>
          <div className="dialog-max dialog-icon" onClick={onMaximize}></div>
        </div>
        <div className="title" >{name}</div>
      </div>
      <div className="dialog-content">
      {children}
      </div>
    </div>
  );
}

export default Dialog;