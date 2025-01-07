import React, {useState} from "react";

const ContactSalesSection = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <section className="py-32">
      {/* Section Title */}
      <div className="container mx-auto text-center px-6">
        <h1 className="text-7xl font-bold mb-4 text-white">Manufacturing Simplified</h1>
        <h5 className="text-lg text-gray-700">
          Custom Parts | EMS | Product Assembly
        </h5>
      </div>

      {/* Button */}
      <div className="text-center mt-6">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          onClick={toggleModal}
        >
          Contact Sales
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold">Contact Sales</h3>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={toggleModal}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first-name"
                  placeholder="Name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Contact"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>

              {/* Manufacturing Process */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Which manufacturing process are you looking for?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="manufacturing-process"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">—Please choose an option—</option>
                  <option value="CNC Machining">CNC Machining</option>
                  <option value="Sheet Metal">Sheet Metal</option>
                  <option value="Injection Moulding">Injection Moulding</option>
                  <option value="Casting">Casting</option>
                  <option value="Forging">Forging</option>
                  <option value="Electronics Integration">
                    Electronics Integration
                  </option>
                  <option value="Fabrication">Fabrication</option>
                  <option value="Proto Processes">Proto Processes</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Design Files */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Do you have the design files?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="design-files"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="">—Please choose an option—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">
                  Comments <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="comments"
                  placeholder="Type a message here.."
                  rows={4}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-right">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSalesSection;
