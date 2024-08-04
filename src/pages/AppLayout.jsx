/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Input } from "../components/layout";
import PageNav from "../components/PageNav";
import { supabase } from "../supabase";
import { useForm } from "react-hook-form";

const exampleProducts = [
  {
    product_name: "Item 1",
    sku: "SKU1",
    family: "Family 1",
    sub_family: "Subfamily 1",
    subject_to_shelf_life: "Yes",
    unit: "Unit 1",
    quantity: 10,
    bal_due: 5,
  },
  {
    product_name: "Item 2",
    sku: "SKU2",
    family: "Family 2",
    sub_family: "Subfamily 2",
    subject_to_shelf_life: "No",
    unit: "Unit 2",
    quantity: 5,
    bal_due: 2.5,
  },
];

function AppLayout() {
  const [values, setValues] = useState({
    nextSalesId: null,
    client_id: null,
  });
  const [selectedProducts, setSelectedProducts] = useState(exampleProducts);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const getNextSalesId = async () => {
      const { data, error } = await supabase
        .from("SalesOrder")
        .select("sales_id, client_id");
      if (error) console.log("Error loading sales", error);
      else {
        const lastId = data.length
          ? Math.max(...data.map((order) => order.sales_id))
          : 0;
        const clientId = data[data.length - 3]?.client_id || null;
        setValues((prevValues) => ({
          ...prevValues,
          nextSalesId: lastId + 1,
          client_id: clientId,
        }));
      }
    };
    getNextSalesId();
  }, []);

  const handleSave = async (data) => {
    // Start by saving the main sales order data
    const sanitizedData = {
      ...data,
      client_id: values.client_id,
      order_date: data.order_date ? new Date(data.order_date).toISOString() : new Date().toISOString(),
      ship_date_1: data.ship_date_1 ? new Date(data.ship_date_1).toISOString()
        : null,
      ship_date_2: data.ship_date_2
        ? new Date(data.ship_date_2).toISOString()
        : null,
      date_of_ship: data.date_of_ship
        ? new Date(data.date_of_ship).toISOString()
        : null,
      date_of_arrival: data.date_of_arrival ? new Date(data.date_of_arrival).toISOString()
        : null,
      total_cost: data.total_cost || 0,
      status: data.status || "Pending",
      currency: "CAD",
    };

    console.log("Sanitized data: ",sanitizedData);

    try {
      setSubmitLoading(true);

      // Insert the sales order and get the order ID
     
      const { data: salesOrderData, error } = await supabase
        .from("SalesOrder")
        .insert([sanitizedData])
        .select();

      if (error) throw error 

      const salesOrderId = salesOrderData[0].sales_id;

      // Insert each product into the SalesOrderItems table with the sales order ID
      const productsToSave = selectedProducts.map((product) => ({
        sales_order_id: salesOrderId,
        ...product,
      }));

      const { error: productError } = await supabase
        .from("SalesOrderItems")
        .insert([productsToSave]);

      if (productError){
        console.log("Error saving in salesorderitems table: ", productsToSave)
        throw productError;
      }

      alert("Sales order and products saved successfully");
      reset();
      setSubmitLoading(false);
      navigate("/sales");
    } catch (error) {
      alert("An unexpected error has occurred!");
      console.log("Error creating record in Supabase", error);
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <PageNav />
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <form className="mt-5 fs-4" onSubmit={handleSubmit(handleSave)}>
            <h2 style={{ fontWeight: "bold" }}>Sales order</h2>
            <Input label="Id" disabled value={values.nextSalesId || ""} />
            <Input
              register={register}
              label="Client name"
              name="client"
              defaultValue=""
            />

            <hr className="hr my-4" />
            <h2 style={{ fontWeight: "bold" }}>Product</h2>
            <Input
              label="Product name"
              name="product_name"
              register={register}
              defaultValue=""
            />
            <Input
              register={register}
              name="stock"
              label="Stock"
              type="number"
              disabled
              defaultValue=""
            />
            <Input
              register={register}
              name="order_quantity"
              label="Order quantity"
              type="number"
              defaultValue=""
            />
            <Input
              register={register}
              name="bal_due"
              label="Bal due"
              disabled
              defaultValue=""
            />
            <button className="btn btn-primary fs-4" type="button">
              Add product to sale
            </button>

            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Family</th>
                  <th>Subfamily</th>
                  <th>Subject to Shelf Life</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Balance Due</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.product_name}</td>
                    <td>{product.sku}</td>
                    <td>{product.family}</td>
                    <td>{product.subfamily}</td>
                    <td>{product.subject_to_shelf_life}</td>
                    <td>{product.unit}</td>
                    <td>{product.quantity}</td>
                    <td>{product.balance_due}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <hr className="hr my-4" />
            <h2 className="mt-4" style={{ fontWeight: "bold" }}>
              Shipment
            </h2>
            <Input
              register={register}
              name="order_date"
              label="Order date"
              type="date"
              defaultValue=""
            />

            <Dropdown
              label="Partial Shipment"
              name="partial_shipment"
              register={register}
              options={["", "Yes", "No"]}
            />

            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_1"
                  label="Ship Date 1"
                  type="date"
                  defaultValue=""
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Count days to sched date 1"
                  disabled={true}
                  defaultValue=""
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_2"
                  label="Ship Date 2"
                  type="date"
                  defaultValue=""
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Count days to sched date 2"
                  disabled={true}
                  defaultValue=""
                />
              </div>
            </div>

            <Dropdown
              label="Operation Status"
              register={register}
              name="status"
              options={[
                "",
                "Work Order - Initial",
                "Purchasing",
                "Work Order - Secondary", // Ensure unique keys
                "Incoming",
                "Quality",
                "Kitting",
                "Production",
                "Shipping",
              ]}
            />

            <Input
              register={register}
              name="date_of_ship"
              label="Date of shipment"
              type="date"
              defaultValue=""
            />
            <Input
              label="Lead Time (from order to shipping)"
              disabled={true}
              defaultValue=""
            />
            <Input label="Shipped on time?" disabled={true} defaultValue="" />
            <Dropdown
              label="Status of shipment"
              register={register}
              name="status_of_shipment"
              options={["", "Delayed", "On the way", "Delivered"]}
            />
            <Input
              register={register}
              name="date_of_arrival"
              label="Date of arrival"
              type="date"
              defaultValue=""
            />
            <Input
              label="Transit time (from shipment to delivery)"
              disabled={true}
              defaultValue=""
            />
            <Input label="Total time" disabled={true} defaultValue="" />
            <Input
              register={register}
              name="comments"
              label="Comments"
              defaultValue=""
            />

            <div className="d-flex gap-3 flex-row-reverse my-4">
              <button
                className="btn btn-primary fs-4 10 w-100"
                type="submit"
                style={{ maxWidth: "200px" }}
              >
                {submitLoading ? "Processing..." : "Save"}
              </button>
              <button
                className="btn btn-outline-primary fs-4 10 w-100"
                style={{ maxWidth: "200px" }}
                type="button"
                onClick={() => {
                  reset();
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
