import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input, Dropdown } from "../components/layout";
import PageNav from "../components/PageNav";
import { daysBetween, formatDate } from "../helpers";
import { supabase } from "../supabase";

const SalesOrderDetails = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [salesOrderData, setSalesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        console.log("Fetching data for sales order ID:", id);
        const { data, error } = await supabase.from("SalesOrder").select("*").eq("sales_id", id);
        if (error) {
          setError("An unexpected error has occurred");
          console.log("Supabase error:", error);
        } else if (data && data.length > 0) {
          const singleSalesOrder = data[0];
          console.log("Fetched sales order data:", singleSalesOrder);
          setSalesData(singleSalesOrder);

          // Set form field values
          Object.keys(singleSalesOrder).forEach((key) => {
            setValue(key, singleSalesOrder[key]);
          });
        } else {
          setError("No sales order found");
          console.log("No data found for the given ID");
        }
      } catch (error) {
        setError("Error fetching data from server");
        console.log("Fetch error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [id, setValue]);

  const navigate = useNavigate();

  const handleUpdate = async (data) => {
    // Here we Prepare data for update and remove fields that should not be updated.
    const updatedData = { ...data };
    delete updatedData.sales_id;
    delete updatedData.last_updated_at;
    delete updatedData.created_at;
    try {
      setUpdateLoading(true);
      const { error } = await supabase.from("SalesOrder").update(updatedData).eq("sales_id", id);
      if (error) {
        throw error;
      }
      alert("Saved successfully");
      reset();
      setUpdateLoading(false);
      navigate("/sales");
    } catch (error) {
      alert(error.message);
      setUpdateLoading(false);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // Logic to disable the button to create a work order
  let disableButton = true;
  if (salesOrderData.amount != null && salesOrderData.order_quantity != null)
    disableButton =
      salesOrderData.amount !== 0 &&
      salesOrderData.amount > salesOrderData.order_quantity;

  return (
    <div>
      <PageNav />
      <div className="d-flex justify-content-center align-items-center mt-4">
      <div className="container my-4" style={{ maxWidth: '1200px' }}>
        <form className={"mt-5 fs-4 row"} onSubmit={handleSubmit(handleUpdate)}>
          <div className="col-md-6">
            <Input
              label="Sales Order"
              disabled
              value={salesOrderData.sales_id}
            />
            <Input register={register} label="Client" name="client" />
            <Input register={register} label="SKU#" name="sku" />
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
                disabled={disableButton}
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
            <Input register={register} name="bal_due" label="Bal due" />
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
              value={daysBetween(
                salesOrderData.ship_date_1,
                formatDate(new Date())
              )}
            />
            <Input
              label="Count days to sched date 2"
              disabled={true}
              value={daysBetween(
                salesOrderData.ship_date_2,
                formatDate(new Date())
              )}
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
              value={daysBetween(
                salesOrderData.date_of_ship,
                salesOrderData.order_date
              )}
            />

            <Dropdown
              label="Shipped on time?"
              name="was_ship_on_time"
              register={register}
              options={["", "Yes", "No"]}
            />

            <Dropdown
              label="Status of shipment"
              register={register}
              name="status_of_shipment"
              options={["", "Delayed", "On the way", "Delivered"]}
            />

            <Dropdown
              label="status"
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
              ]}
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
              value={daysBetween(
                salesOrderData.date_of_arrival,
                salesOrderData.date_of_ship
              )}
            />
            <Input
              label="Total time"
              disabled={true}
              value={daysBetween(
                salesOrderData.date_of_arrival,
                salesOrderData.order_date
              )}
            />
            <Input register={register} name="comments" label="Comments" />
          </div>

          <div className="d-flex gap-3 flex-row-reverse mt-4">
            <button
              className="btn btn-primary fs-4 10 w-100"
              type="submit"
              style={{ maxWidth: "200px" }}
            >
              {updateLoading ? "Processing..." : "Save"}
            </button>
            <button
              className="btn btn-outline-primary fs-4 10 w-100"
              style={{ maxWidth: "200px" }}
              type="button"
              // onClick={() => {
              //   reset();
              // }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SalesOrderDetails;
