import React, { useState, useEffect, useReducer, useCallback } from 'react';

interface Property {
  id: string
  name: string
  style: any
  top: number
  left: number
  width: number
  height: number
  hidden?: boolean
  onClose: (dialogId: string) => void
  onMinimize: (dialogId: string) => void
}

let incrementIndex = 10;

const reducer = (state: any, action: any) => {
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
      if (state.resizing) {
        return {
          ...state,
          width: action.x - state.left,
          height: action.y - state.top,
        }
      }
      return state;
    case 'resize_start':
      return {
        ...state,
        x: action.x,
        y: action.y,
        resizing: true,
        zIndex: incrementIndex++
      }
    case 'mouseup':
      if (!state.dragging && !state.resizing) return state;
      return {
        ...state,
        dragging: false,
        resizing: false,
      }
    case 'hover':
      return {
        ...state,
        icon: {
          hover: action.state,
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
    mouse: { x: 0, y: 0 },
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
  })
  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      dispatch({
        type: 'drag',
        x: e.clientX,
        y: e.clientY,
      })
    }
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])
  const showTop = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'show_top'})
  }, []);
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({type: 'drag_start', x: e.clientX, y: e.clientY})
  }, [])
  const onResizeMouseDown = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'resize_start', x: e.clientX, y: e.clientY})
  }, [])
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'mouseup'})
  }, [])
  const onMouseEnter = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'hover', state: true})
  }, [])
  const onMouseLeave = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'hover', state: false})
  }, [])
  const onDialogClose = useCallback((e: React.MouseEvent) => {
    onClose(id);
  }, [onClose])
  const onMaximize = useCallback((e: React.MouseEvent) => {
    dispatch({type: "maximize"});
  }, [])
  const onDialogMinimize = useCallback((e: React.MouseEvent) => {
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
      }}
      className={'dialog' + (state.dragging ? ' dialog-selected' : '') + (hidden ? ' hidden' : '')}
      onClick={showTop}
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
      <div onMouseDown={onResizeMouseDown} onMouseUp={onMouseUp} style={{cursor: 'nwse-resize', position: "absolute", bottom: 0, right: 0}}>//</div>
    </div>
  );
}

export default Dialog;