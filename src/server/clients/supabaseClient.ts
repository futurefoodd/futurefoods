import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config()

const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb3RuZ2RwamdlZXliYmZkb2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyOTYyMDQsImV4cCI6MjA2OTg3MjIwNH0.Rvwe1AVqE3FTP9W5Y9RzNbscAeCPVLSTJhSSveDOSMk';
const supabaseURL = 'https://cdotngdpjgeeybbfdoit.supabase.co';

export const supabase = createClient(supabaseURL, supabaseServiceKey);
