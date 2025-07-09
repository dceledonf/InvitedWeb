import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://ksmvltkxgbsfgyyrbclr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzbXZsdGt4Z2JzZmd5eXJiY2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDc2NTksImV4cCI6MjA2MDMyMzY1OX0.b3lPUwhkz1EJufq3zgjhyOcAKdKaRtaF4bXXWMu9E9Q'
);