import { useCallback, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Intro from './components/Intro.jsx';
import Timeline from './components/Timeline.jsx';
import Education from './components/Education.jsx';
import Skills from './components/Skills.jsx';
import DetailDialog from './components/DetailDialog.jsx';
import StaticTimeline from './components/StaticTimeline.jsx';
import { IS_STATIC } from './mode.js';

export default function App() {
  const [openId, setOpenId] = useState(null);
  const triggerRef = useRef(null);

  const open = useCallback((id) => {
    // Remember the bubble that opened the dialog (not role links inside it) to restore focus on close
    if (!openId) triggerRef.current = document.activeElement;
    setOpenId(id);
  }, [openId]);

  const close = useCallback(() => {
    setOpenId(null);
    triggerRef.current?.focus?.();
    triggerRef.current = null;
  }, []);

  return (
    <>
      <div className="page">
        <Header />
        <Intro />
        {IS_STATIC ? <StaticTimeline /> : <Timeline onOpen={open} />}
        <Education />
        <Skills />
      </div>
      {!IS_STATIC && openId && <DetailDialog id={openId} onOpen={open} onClose={close} />}
    </>
  );
}
