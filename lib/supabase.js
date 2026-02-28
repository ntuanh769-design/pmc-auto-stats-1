import { createClient } from '@supabase/supabase-js';

// THAY THÔNG TIN CỦA BẠN VÀO DƯỚI ĐÂY
const supabaseUrl = 'https://nlirpdbruambhkjjudoa.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5saXJwZGJydWFtYmhramp1ZG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1OTc3NjIsImV4cCI6MjA4NDE3Mzc2Mn0.bR3IodMstSurbxMBjJj1mZmJrD7bEdrwZU2ejhfGDLA'; 

export const supabase = createClient(supabaseUrl, supabaseKey);