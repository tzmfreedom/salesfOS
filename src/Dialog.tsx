import React, { useState, useEffect, useReducer, useCallback } from 'react';

interface Property {
  id: string
  name: string
  style: any
  top: number
  left: number
  width: number
  height: number
  onClose: (e: React.MouseEvent) => void
  onMinimize: (e: React.MouseEvent) => void
  onMaximize: (e: React.MouseEvent) => void
}

let incrementIndex = 10;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'drag_start':
      return {
        ...state,
        x: action.x,
        y: action.y,
        selected: true,
        zIndex: incrementIndex++
      }
    case 'drag_dialog':
      if (!state.selected) return state;
      return {
        ...state,
        x: action.x,
        y: action.y,
        top: state.top + action.y - state.y,
        left: state.left + action.x - state.x,
      }
    case 'mouseup':
      if (!state.selected) return state;
      return {
        ...state,
        selected: false,
      }
    default:
      console.log(action);
      throw new Error();
  }
}

const Dialog: React.FC<Property> = ({ children, style, id, name, top, left, width, height, onClose, onMinimize, onMaximize }) => {
  const [state, dispatch] = useReducer(reducer, {
    mouse: { x: 0, y: 0 },
    top,
    left,
    width,
    height,
    zIndex: incrementIndex,
    selected: false,
  })
  // const onResizeMouseDown = (e: React.MouseEvent) => {
  //   setIsResize(true)
  //   setMouse({x: e.clientX, y: e.clientY})
  // }
  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      dispatch({
        type: 'drag_dialog',
        x: e.clientX,
        y: e.clientY,
      })
    }
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({type: 'drag_start', x: e.clientX, y: e.clientY})
  }, [])
  // const onResizeMouseUp = (e: React.MouseEvent) => {
  //   setIsResize(false)
  // }
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'mouseup'})
  }, [])

  return (
    <div id={id} 
      style={{...style, left: state.left, top: state.top, width: state.width, height: state.height, zIndex: state.zIndex}}
      className={'dialog' + (state.selected ? ' dialog-selected' : '')}
      >
      <div className="title-bar" onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
        <div className="dialog-close" onClick={onClose}></div>
        <div className="dialog-min" onClick={onMinimize}></div>
        <div className="dialog-max" onClick={onMaximize}></div>
        <div className="title" >{name}</div>
      </div>
      <div className="dialog-content">
      {children}
      </div>
      <div onMouseDown={() => {}} onMouseUp={() => {}} style={{position: "absolute", bottom: 0, right: 0}}>//</div>
    </div>
  );
}

export default Dialog;