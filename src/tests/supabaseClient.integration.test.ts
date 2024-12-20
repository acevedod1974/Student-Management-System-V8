import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

beforeAll(async () => {
  // Clean up before tests
  await supabase.from("test_table").delete().eq("email", "test@example.com");
});

afterAll(async () => {
  // Clean up after tests
  await supabase.from("test_table").delete().eq("email", "test@example.com");
});

describe("Supabase Client Integration", () => {
  it("should insert and retrieve data from the test_table", async () => {
    // Insert data
    const {
      error: insertError,
      status: insertStatus,
      statusText: insertStatusText,
    } = await supabase
      .from("test_table")
      .insert([{ name: "Test User", email: "test@example.com" }]);

    console.log("Insert Error:", insertError);
    console.log("Insert Status:", insertStatus);
    console.log("Insert Status Text:", insertStatusText);

    expect(insertError).toBeNull();
    expect(insertStatus).toBe(201);

    // Retrieve data
    const {
      data: selectData,
      error: selectError,
      status: selectStatus,
      statusText: selectStatusText,
    } = await supabase
      .from("test_table")
      .select("*")
      .eq("email", "test@example.com");

    console.log("Select Error:", selectError);
    console.log("Select Data:", selectData);
    console.log("Select Status:", selectStatus);
    console.log("Select Status Text:", selectStatusText);

    expect(selectError).toBeNull();
    expect(selectData).not.toBeNull();
    expect(selectData).toHaveLength(1);
    expect(selectData![0].name).toBe("Test User");
    expect(selectData![0].email).toBe("test@example.com");

    // Clean up
    const {
      error: deleteError,
      status: deleteStatus,
      statusText: deleteStatusText,
    } = await supabase
      .from("test_table")
      .delete()
      .eq("email", "test@example.com");

    console.log("Delete Error:", deleteError);
    console.log("Delete Status:", deleteStatus);
    console.log("Delete Status Text:", deleteStatusText);

    expect(deleteError).toBeNull();
  });
});
