import { AlertDialog, Flex, Button, Strong } from "@radix-ui/themes";
type DeleteConfirmationProps = {
  deletedType: string;
  deletedLabel: string;
  onDelete: () => void;
  onCancel: () => void;
};

export const DeleteConfirmation = ({
  deletedType,
  deletedLabel,
  onDelete,
  onCancel,
}: DeleteConfirmationProps) => {
  return (
    <AlertDialog.Content maxWidth="520px">
      <AlertDialog.Title>Delete {deletedType}</AlertDialog.Title>
      <AlertDialog.Description size="2" mb="4">
        Are you sure? The {deletedType} <Strong>{deletedLabel}</Strong> will be
        permanently deleted.
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button
            variant="surface"
            color="gray"
            onClick={onCancel}
            highContrast
          >
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button variant="surface" color="red" onClick={onDelete}>
            Delete {deletedType}
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  );
};
