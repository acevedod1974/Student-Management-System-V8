import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

beforeAll(async () => {
  // Clean up before tests
  await supabase.from("test_table").delete().eq("email", "test@example.com");
}, 10000); // Increase timeout to 10 seconds

afterAll(async () => {
  // Clean up after tests
  await supabase.from("test_table").delete().eq("email", "test@example.com");
}, 10000); // Increase timeout to 10 seconds

describe("Supabase Client Integration", () => {
  it("should insert and retrieve data from the test_table", async () => {
    // Insert data
    const { error: insertError, status: insertStatus } = await supabase
      .from("test_table")
      .insert([{ name: "Test User", email: "test@example.com" }]);

    console.log("Insert Error:", insertError);
    console.log("Insert Status:", insertStatus);

    expect(insertError).toBeNull();
    expect(insertStatus).toBe(201);

    // Retrieve data
    const { data: selectData, error: selectError } = await supabase
      .from("test_table")
      .select("*")
      .eq("email", "test@example.com");

    console.log("Select Error:", selectError);
    console.log("Select Data:", selectData);

    expect(selectError).toBeNull();
    expect(selectData).not.toBeNull();
    expect(selectData).toHaveLength(1);
    expect(selectData![0].name).toBe("Test User");
    expect(selectData![0].email).toBe("test@example.com");

    // Clean up
    const { error: deleteError } = await supabase
      .from("test_table")
      .delete()
      .eq("email", "test@example.com");

    console.log("Delete Error:", deleteError);

    expect(deleteError).toBeNull();
  }, 10000); // Increase timeout to 10 seconds
});
