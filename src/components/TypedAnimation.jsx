// TypedAnimation.js
import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const TypedAnimation = () => {
  const el = useRef(null);
  const typed = useRef(null);

  useEffect(() => {
    const options = {
      strings: ["Welcome to our website!", "We create awesome web applications.", "Contact us for more information."],
      typeSpeed: 60,
      backSpeed: 25,
      loop: true,
    };

    // elRef refers to the <span> rendered below
    typed.current = new Typed(el.current, options);

    return () => {
      // Make sure to destroy Typed instance during cleanup to prevent memory leaks
      typed.current.destroy();
    };
  }, []);

  return (
    <div className="type-wrapper">
      <span ref={el} />
    </div>
  );
};

export default TypedAnimation;
