import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Input } from "../components/layout";
import PageNav from "../components/PageNav";
import { supabase } from "../supabase";
import { useForm } from "react-hook-form";

function AppLayout() {
  const [values, setValues] = useState({
    nextSalesId: null,
    client_id: null,
  });

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
        const clientId = data[data.length - 3]?.client_id;
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
    const sanitizedData = {
      ...data,
      client_id: values.client_id,
      order_date: data.order_date
        ? new Date(data.order_date).toISOString()
        : new Date().toISOString(),
      ship_date_1: data.ship_date_1
        ? new Date(data.ship_date_1).toISOString()
        : null,
      ship_date_2: data.ship_date_2
        ? new Date(data.ship_date_2).toISOString()
        : null,
      date_of_ship: data.date_of_ship
        ? new Date(data.date_of_ship).toISOString()
        : null,
      date_of_arrival: data.date_of_arrival
        ? new Date(data.date_of_arrival).toISOString()
        : null,
      total_cost: data.total_cost || 0,
      status: data.status || "Pending",
      currency: "CAD",
      order_details: data.product_name || "",
      order_quantity: data.order_quantity
        ? parseFloat(data.order_quantity)
        : null,
      bal_due: data.bal_due ? parseFloat(data.bal_due) : null,
    };
    try {
      setSubmitLoading(true);
      const { error } = await supabase
        .from("SalesOrder")
        .insert([sanitizedData]);
      if (error) {
        throw error;
      } else {
        alert("Product Creation was successful");
        reset();
        setSubmitLoading(false);
        navigate("/sales");
      }
    } catch (error) {
      alert("An unexpected error has occurred!");
      console.log("Error creating record in supabase", error);
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <PageNav />
      <div className="container my-4" style={{ maxWidth: "1200px" }}>
        <form className="mt-5 fs-4" onSubmit={handleSubmit(handleSave)}>
          {/* Sales Order Section */}
          <fieldset className="mb-4">
            <legend>Sales Order</legend>
            <div className="row">
              <div className="col-md-6">
                <Input label="Id" disabled value={values.nextSalesId} />
              </div>
              <div className="col-md-6">
                <Input register={register} label="Client name" name="client" />
              </div>
            </div>
          </fieldset>

          {/* Product Section */}
          <fieldset className="mb-4">
            <legend>Product</legend>
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  label="Product name"
                  name="product_name"
                />
              </div>
              <div className="col-md-6">
                <Input label="Stock" disabled />
              </div>
              <div className="col-md-6">
                <Input
                  register={register}
                  label="Order quantity"
                  name="order_quantity"
                  type="number"
                />
              </div>
              <div className="col-md-6">
                <Input register={register} label="Bal due" name="bal_due" />
              </div>
            </div>
            <button
              className="btn btn-primary fs-5 mt-3"
              type="button"
              onClick={() => {
                /* Add Product Logic */
              }}
            >
              Add product to sale
            </button>
          </fieldset>

          {/* Product Table Section */}
          <div className="mb-4">
            <table className="table table-striped">
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
                <tr>
                  <td>Item 1</td>
                  <td>SKU1</td>
                  <td>Family 1</td>
                  <td>Subfamily 1</td>
                  <td>Yes</td>
                  <td>Unit 1</td>
                  <td>10</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>Item 2</td>
                  <td>SKU1</td>
                  <td>Family 1</td>
                  <td>Subfamily 1</td>
                  <td>Yes</td>
                  <td>Unit 1</td>
                  <td>10</td>
                  <td>5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Shipment Section */}
          <fieldset className="mb-4">
            <legend>Shipment</legend>
            <div className="row">
              <div className="col-md-6">
                <Input
                  register={register}
                  name="order_date"
                  label="Order date"
                  type="date"
                />
                <Dropdown
                  label="Partial Shipment"
                  name="partial_shipment"
                  register={register}
                  options={["", "Yes", "No"]}
                />
                <Input
                  register={register}
                  name="ship_date_1"
                  label="Ship Date 1"
                  type="date"
                />
                <Input label="Count days to sched date 1" disabled={true} />
                <Input
                  register={register}
                  name="date_of_ship"
                  label="Date of shipment"
                  type="date"
                />
                <Input
                  label="Lead Time (from order to shipping)"
                  disabled={true}
                />
              </div>
              <div className="col-md-6">
                <Input
                  register={register}
                  name="ship_date_2"
                  label="Ship Date 2"
                  type="date"
                />
                <Input label="Count days to sched date 2" disabled={true} />
                <Input label="Shipped on time?" disabled={true} />
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
                />
                <Input
                  label="Transit time (from shipment to delivery)"
                  disabled={true}
                />
                <Input label="Total time" disabled={true} />
              </div>
              <div className="col-md-12">
                <Input register={register} name="comments" label="Comments" />
              </div>
            </div>
          </fieldset>

          {/* Form Buttons */}
          <div className="d-flex gap-3 flex-row-reverse">
            <button
              className="btn btn-primary fs-4 w-100"
              type="submit"
              style={{ maxWidth: "200px" }}
            >
              {submitLoading ? "Processing..." : "Save"}
            </button>
            <button
              className="btn btn-outline-primary fs-4 w-100"
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
  );
}

export default AppLayout;
