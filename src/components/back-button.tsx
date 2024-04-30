'use client';

import { Button } from './ui/button';

export async function BackButton() {
  const goBackHandler = () => {
    window.history.back();
  };

  return (
    <Button type='submit' onClick={goBackHandler}>
      Back
    </Button>
  );
}