import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/app/components/ui/alert-dialog';
import { DollarSign, TrendingUp, Clock, Trash2, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface Invoice {
  id: string;
  customerName: string;
  service: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    customerName: 'John Smith',
    service: 'House Exterior Wash',
    amount: 350,
    status: 'paid',
    dueDate: new Date(2026, 0, 20),
    paidDate: new Date(2026, 0, 18)
  },
  {
    id: 'INV-002',
    customerName: 'Sarah Johnson',
    service: 'Driveway Cleaning',
    amount: 175,
    status: 'pending',
    dueDate: new Date(2026, 1, 5)
  },
  {
    id: 'INV-003',
    customerName: 'Michael Brown',
    service: 'Deck/Patio Cleaning',
    amount: 225,
    status: 'paid',
    dueDate: new Date(2026, 0, 15),
    paidDate: new Date(2026, 0, 14)
  },
  {
    id: 'INV-004',
    customerName: 'Emily Davis',
    service: 'Roof Cleaning',
    amount: 450,
    status: 'overdue',
    dueDate: new Date(2026, 0, 10)
  }
];

export function InvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  // Load invoices from localStorage on component mount
  useEffect(() => {
    const loadInvoices = () => {
      const savedInvoices = localStorage.getItem('kr-invoices');
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        // Convert date strings back to Date objects
        const invoicesWithDates = parsedInvoices.map((inv: any) => ({
          ...inv,
          dueDate: new Date(inv.dueDate),
          paidDate: inv.paidDate ? new Date(inv.paidDate) : undefined
        }));
        setInvoices(invoicesWithDates);
      } else {
        // Initialize with mock data if no saved data exists
        setInvoices(mockInvoices);
        localStorage.setItem('kr-invoices', JSON.stringify(mockInvoices));
      }
    };

    loadInvoices();

    // Listen for invoice updates from other components
    const handleInvoicesUpdate = () => {
      loadInvoices();
    };

    window.addEventListener('kr-invoices-updated', handleInvoicesUpdate);
    return () => window.removeEventListener('kr-invoices-updated', handleInvoicesUpdate);
  }, []);

  // Save invoices to localStorage whenever they change
  useEffect(() => {
    if (invoices.length >= 0 && localStorage.getItem('kr-invoices')) {
      localStorage.setItem('kr-invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  // Load customers from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('kr-customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    // Listen for customer updates
    const handleCustomersUpdate = () => {
      const updatedCustomers = localStorage.getItem('kr-customers');
      if (updatedCustomers) {
        setCustomers(JSON.parse(updatedCustomers));
      }
    };

    window.addEventListener('kr-customers-updated', handleCustomersUpdate);
    return () => window.removeEventListener('kr-customers-updated', handleCustomersUpdate);
  }, []);

  // Get customer email by name
  const getCustomerEmail = (customerName: string): string => {
    const customer = customers.find(c => c.name === customerName);
    return customer?.email || '';
  };

  // Generate mailto link for emailing invoice to customer
  const handleEmailInvoice = (invoice: Invoice) => {
    const customerEmail = getCustomerEmail(invoice.customerName);
    const subject = encodeURIComponent(`Invoice ${invoice.id} from K&R Powerwashing`);
    const statusText = invoice.status === 'paid'
      ? 'This invoice has been marked as PAID. Thank you for your payment!'
      : invoice.status === 'overdue'
      ? 'This invoice is currently OVERDUE. Please remit payment at your earliest convenience.'
      : 'Payment is due by the date shown below.';

    const body = encodeURIComponent(
`Dear ${invoice.customerName},

Please find your invoice details below:

Invoice ID: ${invoice.id}
Service: ${invoice.service}
Amount Due: $${invoice.amount.toLocaleString()}
Due Date: ${format(invoice.dueDate, 'MMMM d, yyyy')}
Status: ${invoice.status.toUpperCase()}

${statusText}

If you have any questions about this invoice, please don't hesitate to contact us.

Best regards,
K&R Powerwashing Team`
    );
    const mailtoLink = `mailto:${customerEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(invoices.map(inv => 
      inv.id === invoiceId 
        ? { 
            ...inv, 
            status: newStatus,
            paidDate: newStatus === 'paid' ? new Date() : undefined
          }
        : inv
    ));
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(inv => inv.id !== invoiceId));
  };

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const pendingPayments = invoices
    .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueCount = invoices.filter(inv => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {invoices.filter(inv => inv.status === 'paid').length} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayments.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">
              {invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <TrendingUp className="size-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <p className="text-xs text-gray-500 mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>

      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{invoice.service}</TableCell>
                <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                <TableCell>{format(invoice.dueDate, 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  {invoice.paidDate ? format(invoice.paidDate, 'MMM d, yyyy') : '-'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === 'paid'
                        ? 'default'
                        : invoice.status === 'pending'
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={invoice.status}
                      onValueChange={(value: Invoice['status']) => handleStatusChange(invoice.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEmailInvoice(invoice)}
                      title="Email invoice to customer"
                    >
                      <Mail className="size-4 text-green-600" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete invoice"
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete invoice {invoice.id} for {invoice.customerName}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteInvoice(invoice.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}