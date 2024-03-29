import { pool } from "../db.js";

// Controlador para obtener todos los empleados de la base de datos
export const getEmployees = async (req, res) => {
  try {
    // Realizar una consulta a la base de datos para seleccionar todos los empleados
    const [rows] = await pool.query("SELECT * FROM employee");

    // Enviar una respuesta al cliente en formato JSON con los resultados de la consulta
    res.json(rows);
  } catch (error) {
    // Manejar errores en la obtención de empleados y enviar una respuesta de error 500 (Error interno del servidor)
    console.error("Error getting employees:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controlador para obtener un empleado específico de la base de datos por su ID
export const getEmployee = async (req, res) => {
  try {
    // Realizar una consulta a la base de datos para seleccionar un empleado por su ID
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      req.params.id,
    ]);

    // Verificar si se encontraron resultados en la consulta
    if (rows.length <= 0) {
      // Si no se encontraron resultados, enviar una respuesta de error 404
      res.status(404).json({ message: "Employee not found" });
    } else {
      // Si se encontraron resultados, enviar una respuesta al cliente con la información del empleado
      res.json(rows[0]);
    }
  } catch (error) {
    // Manejar errores en la obtención de un empleado por ID y enviar una respuesta de error 500 (Error interno del servidor)
    console.error("Error getting employee by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Definir la función asincrónica para crear un empleado
export const createEmployee = async (req, res) => {
  // Extraer el nombre y salario del cuerpo de la solicitud (request)
  const { name, salary } = req.body;

  try {
    // Ejecutar la consulta SQL para insertar un nuevo empleado en la base de datos
    const [rows] = await pool.query(
      "INSERT INTO employee(name, salary) VALUES (?, ?)",
      [name, salary]
    );

    // Enviar una respuesta al cliente con la información del empleado recién creado
    res.send({ id: rows.insertId, name, salary });
  } catch (error) {
    // Manejar cualquier error que pueda ocurrir durante la ejecución de la consulta
    console.error("Error al crear empleado:", error);
  }
};

// Controlador para actualizar la información de un empleado en la base de datos por su ID
export const updateEmployee = async (req, res) => {
  // Extraer el ID, nombre y salario de los parámetros y el cuerpo de la solicitud
  const { id } = req.params;
  const { name, salary } = req.body;
  try {
    // Realizar una consulta a la base de datos para actualizar la información del empleado
    const [result] = await pool.query(
      "UPDATE employee SET name = IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
      [name, salary, id]
    );

    // Verificar si se afectaron filas en la base de datos (si el empleado fue encontrado y actualizado)
    if (result.affectedRows === 0) {
      // Si no se afectaron filas, enviar una respuesta de error 404
      return res.status(404).json({ message: "Employee not found" });
    }

    // Realizar una consulta adicional para obtener la información actualizada del empleado
    const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [
      id,
    ]);

    // Enviar una respuesta al cliente con la información actualizada del empleado
    res.json(rows[0]);
  } catch (error) {
    // Manejar errores en la actualización del empleado y enviar una respuesta de error 500 (Error interno del servidor)
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controlador para eliminar un empleado de la base de datos por su ID
export const deleteEmployee = async (req, res) => {
  try {
    // Realizar una consulta a la base de datos para eliminar un empleado por su ID
    const [result] = await pool.query("DELETE FROM employee WHERE id = ?", [
      req.params.id,
    ]);

    // Verificar si se afectaron filas en la base de datos (si se eliminó algún empleado)
    if (result.affectedRows <= 0) {
      // Si no se afectaron filas, enviar una respuesta de error 404
      return res.status(404).json({ message: "Employee not found" });
    }

    // Si se afectaron filas, enviar una respuesta de éxito con código 204 (Sin contenido)
    res.sendStatus(204);
  } catch (error) {
    // Manejar errores en la eliminación del empleado y enviar una respuesta de error 500 (Error interno del servidor)
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
