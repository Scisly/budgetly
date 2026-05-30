"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { deleteCategoryAction } from "@/actions/category.actions";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoryIcon } from "@/components/categories/category-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category } from "@/lib/types/database.types";

interface CategoriesManagerProps {
  initialCategories: Category[];
}

function CategoryPreview({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="size-3 shrink-0 rounded-full ring-1 ring-border"
        style={{ backgroundColor: category.color }}
        aria-hidden
      />
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted"
        style={{ color: category.color }}
      >
        <CategoryIcon name={category.icon} className="size-4" />
      </span>
      <span className="font-medium">{category.name}</span>
    </div>
  );
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDeleteConfirm() {
    if (!deletingCategory) return;

    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteCategoryAction(deletingCategory.id);
      if (result.error) {
        setDeleteError(result.error);
        return;
      }
      setDeletingCategory(null);
      router.refresh();
    });
  }

  if (initialCategories.length === 0) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
          <p className="text-muted-foreground">
            Brak kategorii. Dodaj pierwszą kategorię.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            Dodaj kategorię
          </Button>
        </div>

        {createOpen && (
          <CategoryForm
            mode="create"
            open={createOpen}
            onOpenChange={setCreateOpen}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>Dodaj kategorię</Button>
      </div>

      <div className="hidden md:block">
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kategoria</TableHead>
                <TableHead className="w-[140px] text-right">Akcje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <CategoryPreview category={category} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditingCategory(category)}
                        aria-label={`Edytuj kategorię ${category.name}`}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setDeleteError(null);
                          setDeletingCategory(category);
                        }}
                        aria-label={`Usuń kategorię ${category.name}`}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {initialCategories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between gap-3 pt-4">
              <CategoryPreview category={category} />
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setEditingCategory(category)}
                  aria-label={`Edytuj kategorię ${category.name}`}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setDeleteError(null);
                    setDeletingCategory(category);
                  }}
                  aria-label={`Usuń kategorię ${category.name}`}
                >
                  <Trash2Icon />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {createOpen && (
        <CategoryForm
          mode="create"
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      )}

      {editingCategory && (
        <CategoryForm
          key={editingCategory.id}
          mode="edit"
          category={editingCategory}
          open={Boolean(editingCategory)}
          onOpenChange={(open) => {
            if (!open) setEditingCategory(null);
          }}
        />
      )}

      <Dialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingCategory(null);
            setDeleteError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Usuń kategorię</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć kategorię{" "}
              <strong>{deletingCategory?.name}</strong>? Tej operacji nie można
              cofnąć.
            </DialogDescription>
          </DialogHeader>

          {deleteError && (
            <p className="text-sm text-destructive" role="alert">
              {deleteError}
            </p>
          )}

          <DialogFooter className="px-0 pb-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingCategory(null)}
              disabled={isDeleting}
            >
              Anuluj
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Usuwanie…" : "Usuń"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
