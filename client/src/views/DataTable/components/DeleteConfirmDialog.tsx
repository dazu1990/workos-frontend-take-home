import { Dialog, Flex, Button, Strong } from "@radix-ui/themes";
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
    <Dialog.Content maxWidth="520px">
      <Dialog.Title>Delete {deletedType}</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Are you sure? The {deletedType} <Strong>{deletedLabel}</Strong> will be
        permanently deleted.
      </Dialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button variant="surface" color="gray" onClick={onCancel}>
            Cancel
          </Button>
        </Dialog.Close>
        <Dialog.Close>
          <Button variant="surface" color="red" onClick={onDelete}>
            Delete {deletedType}
          </Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};
