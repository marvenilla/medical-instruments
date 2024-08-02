import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Input } from "../components/layout";
import PageNav from "../components/PageNav";
import { supabase } from "../supabase";
import { useForm } from "react-hook-form";

function AppLayout() {
  const [values, setValues] = useState({
    nextSalesId: null,
    client_id: null,
  });

  const [sumbitLoading, setSubmitLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const getNextSalesId = async () => {
      const { data, error } = await supabase.from("SalesOrder").select("sales_id, client_id");
      if (error) console.log("Error loading sales", error);
      else {
        const lastId = data.length
          ? Math.max(...data.map((order) => order.sales_id))
          : 0;
          const clientId = data[data.length - 4].client_id;
        setValues((prevValues) => ({
          ...prevValues,
          nextSalesId: lastId + 1,
          client_id: clientId
        }));
      }
    };
    getNextSalesId();
  }, []);

  
  const handleSave = async (data) => {
    const sanitizedData = {
      ...data,
      client_id: values.client_id,
   
      order_date: data.order_date ? new Date(data.order_date).toISOString() : "2024-08-01", // Convert to Date object
      ship_date_1: data.ship_date_1 ? new Date(data.ship_date_1).toISOString() : null,
      ship_date_2: data.ship_date_2 ? new Date(data.ship_date_2).toISOString() : null,
      date_of_ship: data.date_of_ship ? new Date(data.date_of_ship).toISOString() : null,
      date_of_arrival: data.date_of_arrival ? new Date(data.date_of_arrival).toISOString() : null,
      total_cost: data.total_cost || 0,
      status: data.status || 'Pending',
      currency: "CAD",
      order_details: data.product_name || "",
      order_quantity: data.order_quantity ? parseFloat(data.order_quantity) : null,
      bal_due: data.bal_due ? parseFloat(data.bal_due) : null,
    };
    try {
      setSubmitLoading(true);
      const { error } = await supabase.from("SalesOrder").insert([sanitizedData]);
        if (error) {
          throw error;
        }else{
          alert("Product Creation was successful");
          reset();
          setSubmitLoading(false);
          navigate("/sales");
        }
       
    } catch (error) {
      alert("An unexpected error has occurred!");
      console.log("Error creating record in supabase", error)
      setSubmitLoading(false);
    }
  };


  return (
    <div>
      <PageNav />
      <div className="container my-4">
        <form className="mt-5 fs-4 row" onSubmit={handleSubmit(handleSave)}>
          <div className="col-md-6">
            <Input label="Sales Order" disabled value={values.nextSalesId} />
            <Input register={register} label="Client" name="client" />
            <Input register={register} label="SKU#" name="sku" />
            <Input
              label="Product name"
              name="product_name"
              register={register}
            />
            <Dropdown
              label="Family"
              name="family"
              register={register}
              options={["", "Fam1", "Fam2", "Fam3", "Fam4"]}
            />
            <Dropdown
              label="Sub-family"
              name="sub_family"
              register={register}
              options={["", "SubFam1", "SubFam2"]}
            />
            <Dropdown
              label="Subject to shelf life?"
              name="subject_to_shelf_life"
              register={register}
              options={["", "Yes", "No"]}
            />
            <div className="d-flex align-items-center gap-4">
              <Input
                register={register}
                name="order_quantity"
                label="Order quantity"
                type="number"
              />
              <button
                className="btn btn-primary fs-5 10"
                type="button"
                disabled={true}
              >
                <Link
                  to="/work-order"
                  className="text-light text-decoration-none text-nowrap"
                >
                  Create work order
                </Link>
              </button>
            </div>
            <Dropdown
              label="Partial Shipment"
              name="partial_shipment"
              register={register}
              options={["", "Yes", "No"]}
            />
            <Input
              register={register}
              name="bal_due"
              label="Bal due"
            />

            <Input
              register={register}
              name="order_date"
              label="Order date"
              type="date"
            />

          </div>
          <div className="col-md-6">
            <Input
              register={register}
              name="ship_date_1"
              label="Ship Date 1"
              type="date"
            />

            <Input
              register={register}
              name="ship_date_2"
              label="Ship Date 2"
              type="date"
            
            />
            <Input
              label="Count days to sched date 1"
              disabled={true}
            />
            <Input
              label="Count days to sched date 2"
              disabled={true}
            />

            <Dropdown
              label="Operation Status"
              register={register}
              name="status"
              options={[
                "",
                "Work Order",
                "Purchasing",
                "Work Order",
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
            />
            <Input
              label="Lead Time (from order to shipping)"
              disabled={true}
            />
            <Input
              label="Shipped on time?"
              disabled={true}
            />
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
            <Input
              label="Total time"
              disabled={true}
            />
            <Input register={register} name="comments" label="Comments" />
          </div>

          <div className="d-flex gap-3 flex-row-reverse mt-4">
            <button
              className="btn btn-primary fs-4 10 w-100"
              type="submit"
              style={{ maxWidth: "200px" }}
            >
              {sumbitLoading ? "Processing...": "Save"}
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
  );
}

export default AppLayout;
