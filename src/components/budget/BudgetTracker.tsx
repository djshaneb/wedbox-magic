import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Plus } from "lucide-react";

interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
}

export const BudgetTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    amount: ""
  });

  const addExpense = () => {
    if (newExpense.category && newExpense.description && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          category: newExpense.category,
          description: newExpense.description,
          amount: parseFloat(newExpense.amount)
        }
      ]);
      setNewExpense({ category: "", description: "", amount: "" });
    }
  };

  const totalBudget = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Category"
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
        />
        <Input
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
        />
        <Input
          placeholder="Amount"
          type="number"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
        />
        <Button onClick={addExpense}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <DollarSign className="h-5 w-5" />
          Total Budget: ${totalBudget.toFixed(2)}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell>${expense.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};