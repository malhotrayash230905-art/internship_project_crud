document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:5000/customers';
    
    // DOM Elements
    const form = document.getElementById('customer-form');
    const formTitle = document.getElementById('form-title');
    const tableBody = document.getElementById('customer-table-body');
    const customerIdInput = document.getElementById('customer-id');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const statusSelect = document.getElementById('status');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // State
    let isEditing = false;

    // Initialize: Fetch all customers
    fetchCustomers();

    // Event Listeners
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);

    // Fetch and display customers
    async function fetchCustomers() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch customers');
            const customers = await response.json();
            renderTable(customers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            showToast('Failed to load customers. Is the backend running?', 'error');
        }
    }

    // Handle Add or Update
    async function handleFormSubmit(e) {
        e.preventDefault();

        const customerData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone_number: phoneInput.value.trim(),
            account_status: statusSelect.value
        };

        const id = customerIdInput.value;

        try {
            let response;
            if (isEditing && id) {
                // Update existing customer (PUT)
                response = await fetch(`${API_BASE_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });
            } else {
                // Add new customer (POST)
                response = await fetch(API_BASE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(customerData)
                });
            }

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Something went wrong');
            }

            showToast(isEditing ? 'Customer updated successfully' : 'Customer added successfully', 'success');
            resetForm();
            fetchCustomers(); // Refresh table
        } catch (error) {
            console.error('Error saving customer:', error);
            showToast(error.message, 'error');
        }
    }

    // Delete a customer
    async function deleteCustomer(id) {
        if (!confirm('Are you sure you want to delete this customer?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to delete customer');
            }

            showToast('Customer deleted successfully', 'success');
            fetchCustomers(); // Refresh table
            
            // If deleting the currently edited user, reset form
            if (isEditing && customerIdInput.value === id.toString()) {
                resetForm();
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            showToast(error.message, 'error');
        }
    }

    // Edit a customer (populate form)
    function editCustomer(id, name, email, phone, status) {
        isEditing = true;
        formTitle.textContent = 'Edit Customer';
        saveBtn.textContent = 'Update Customer';
        cancelBtn.style.display = 'inline-flex';

        customerIdInput.value = id;
        nameInput.value = name;
        emailInput.value = email;
        phoneInput.value = phone || '';
        statusSelect.value = status || 'Active';
        
        // Smooth scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    // Render the table HTML
    function renderTable(customers) {
        tableBody.innerHTML = '';

        if (customers.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                        No customers found. Add one to get started.
                    </td>
                </tr>
            `;
            return;
        }

        customers.forEach(customer => {
            const tr = document.createElement('tr');
            
            // Format status for CSS class
            const statusClass = customer.account_status === 'Active' ? 'status-active' : 'status-inactive';
            const displayStatus = customer.account_status || 'Active';
            
            tr.innerHTML = `
                <td><strong>${escapeHtml(customer.name)}</strong></td>
                <td><a href="mailto:${escapeHtml(customer.email)}" style="color: var(--primary-color); text-decoration: none;">${escapeHtml(customer.email)}</a></td>
                <td>${escapeHtml(customer.phone_number || 'N/A')}</td>
                <td><span class="status-badge ${statusClass}">${escapeHtml(displayStatus)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-small btn-edit" onclick="window.triggerEdit(${customer.id}, '${escapeHtml(customer.name)}', '${escapeHtml(customer.email)}', '${escapeHtml(customer.phone_number || '')}', '${escapeHtml(displayStatus)}')">Edit</button>
                        <button class="btn btn-small btn-delete" onclick="window.triggerDelete(${customer.id})">Delete</button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Reset the form state
    function resetForm() {
        isEditing = false;
        form.reset();
        customerIdInput.value = '';
        formTitle.textContent = 'Add New Customer';
        saveBtn.textContent = 'Save Customer';
        cancelBtn.style.display = 'none';
    }

    // Toast notification system
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.className = 'toast hidden';
        }, 3000);
    }

    // Utility: Prevent XSS in HTML string interpolation
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
             .toString()
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Expose functions to window object for inline onclick handlers in table
    window.triggerEdit = editCustomer;
    window.triggerDelete = deleteCustomer;
});
