
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const AuthHeader = () => {
  return (
    <header className="absolute top-0 right-0 p-4 z-10">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/signup" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default AuthHeader;
