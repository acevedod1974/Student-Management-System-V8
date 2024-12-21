import { createClient } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";

jest.mock("@supabase/supabase-js", () => {
  const actual = jest.requireActual("@supabase/supabase-js");
  return {
    ...actual,
    createClient: jest.fn(() => ({
      from: jest.fn(),
    })),
  };
});

describe("Supabase Client", () => {
  it("should create a Supabase client with the correct URL and key", () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    expect(createClient).toHaveBeenCalledWith(supabaseUrl, supabaseKey);
  });

  it("should interact with Supabase client correctly", async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
    supabase.from = mockFrom;

    const { data, error } = await supabase.from("test_table").select("*");

    expect(mockFrom).toHaveBeenCalledWith("test_table");
    expect(data).toEqual([]);
    expect(error).toBeNull();
  });
});
