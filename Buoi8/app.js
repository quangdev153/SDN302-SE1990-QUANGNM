const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    await listDatabases(client);
    await createDb(client, "se1990_newdb");


    console.log("\n--- CREATE ---");
    await createStu(client, "se1990_db", "Students", [
      {
        "studentCode": "SV0013",
        "fullName": "Nguyen Van Yeu",
        "gender": "Male",
        "dateOfBirth": "2004-03-15",
        "email": "yeu.nguyen@example.com",
        "major": "Information Technology",
        year: 3,
        gpa: 4
      },
      {
        "studentCode": "SV0014",
        "fullName": "Tran Thi Lan",
        "gender": "Female",
        "dateOfBirth": "2003-07-22",
        "email": "lan.tran@example.com",
        "major": "Information Technology",
        year: 3,
        gpa: 3.75
      }
    ]);

    console.log("\n--- READ ALL ---");
    await listall(client, "se1990_db", "Students");

    console.log("\n--- READ ONE ---");
    await findStu(client, "se1990_db", "Students", { studentCode: "SV0013" });

    console.log("\n--- UPDATE ---");
    await updateStu(client, "se1990_db", "Students", 
      { studentCode: "SV0013" }, 
      { gpa: 4.2, year: 4 }
    );

    console.log("\n--- DELETE ---");
    // Ví dụ: Xóa sinh viên SV0014
    await deleteStu(client, "se1990_db", "Students", { studentCode: "SV0014" });

    console.log("\n--- DANH SÁCH SAU KHI CẬP NHẬT VÀ XÓA ---");
    await listall(client, "se1990_db", "Students");

  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
  } finally {
    await client.close();
    console.log("\nĐã đóng kết nối MongoDB.");
  }
}
main();


async function listDatabases(client) {
  const databasesList = await client.db().admin().listDatabases();
  console.log("Databases:");
  databasesList.databases.forEach((db) => {
    console.log(`- ${db.name}`);
  });
}

async function createDb(client, dbName) {
  const db = client.db(dbName);
  const result = await db.collection("init").insertOne({ status: "database created" });
  console.log(`Database "${dbName}" created successfully.`);
}

async function createStu(client, dbname, colname, docs) {
  const db = client.db(dbname);
  const col = db.collection(colname);
  const result = await col.insertMany(docs);
  console.log(`Inserted ${result.insertedCount} documents into collection "${colname}".`);
}

async function listall(client, dbname, colname) {
  const result = await client.db(dbname).collection(colname).find({}).toArray();
  var count = 0;
  result.forEach(row => {
    count++;
    console.log(`${count}. [${row['studentCode']}] ${row['fullName']} - GPA: ${row['gpa']}`);
  });
}

async function findStu(client, dbname, colname, filter) {
  const result = await client.db(dbname).collection(colname).findOne(filter);
  if (result) {
    console.log(`Tìm thấy:`, result);
  } else {
    console.log(`Không tìm thấy sinh viên khớp với điều kiện.`);
  }
}

async function updateStu(client, dbname, colname, filter, updateData) {
  const result = await client.db(dbname).collection(colname).updateOne(
    filter,
    { $set: updateData } 
  );
  console.log(`Đã tìm thấy ${result.matchedCount} document(s) và cập nhật thành công ${result.modifiedCount} document(s).`);
}

async function deleteStu(client, dbname, colname, filter) {
  const result = await client.db(dbname).collection(colname).deleteOne(filter);
  console.log(`Đã xóa thành công ${result.deletedCount} document(s).`);
}